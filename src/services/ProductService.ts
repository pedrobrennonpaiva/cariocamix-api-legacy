import { Request, Response } from "express";
import { Product } from "../models/Product";
import db, { connect } from '../database/db';
import Message from "../utils/Message";
import { CategoryProduct } from "../models/CategoryProduct";
import { ProductItem } from "../models/ProductItem";
const ProductDb = db.Product;
const CategoryDb = db.Category;
const CategoryProductDb = db.CategoryProduct;
const ProductItemDb = db.ProductItem;
const ItemDb = db.Item;

export class ProductService {

    async get() {

        var models = await ProductDb.find().lean() as Product[];

        for(var model of models)
        { 
            model.productItems = await ProductItemDb.find({ productId: model?.id });
            model.categoryProducts = await CategoryProductDb.find({ productId: model?.id });
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await ProductDb.findOne({ id }).lean() as Product;

            model.productItems = await ProductItemDb.find({ productId: model?.id });
            model.categoryProducts = await CategoryProductDb.find({ productId: model?.id });

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Product();
        model.title = request.body.title;
        model.description = request.body.description;
        model.image = request.body.image;
        model.price = request.body.price;
        model.points = request.body.points;

        var categoryProducts = request.body.categoryProducts as CategoryProduct[];
        var productItems = request.body.productItems as ProductItem[];

        const session = await connect.startSession();
        session.startTransaction();

        const db = new ProductDb(model);

        db.save(async (err: any) => {
            if (err) {
                response.status(400).send({ 
                    success: false, 
                    message: Message.CREATE_ERROR,
                    error: err
                });
            }
            else {

                model.categoryProducts = new Array<CategoryProduct>();
                model.productItems = new Array<ProductItem>();

                var error = '';
                
                if(categoryProducts && categoryProducts !== undefined && categoryProducts.length > 0)
                {
                    for(let x of categoryProducts)
                    {
                        var category = await CategoryDb.findOne({ id: x.categoryId });

                        if(!category)
                        {
                            error += 'Categoria não existe\n';
                            break;
                        }
                        
                        x.productId = model.id;

                        const cdb = new CategoryProductDb(x);

                        cdb.save((cerr: any) => {
                            if(cerr) error += 'Ocorreu um erro ao cadastrar o produto com a categoria\n';
                            else model.categoryProducts?.push(x);
                        });
                    }
                }
                
                if(productItems && productItems !== undefined && productItems.length > 0)
                {
                    for(let x of productItems)
                    {
                        var item = await ItemDb.findOne({ id: x.itemId });
    
                        if(!item)
                        {
                            error += 'Item não existe\n';
                            break;
                        }
                        
                        x.productId = model.id;
    
                        const cdb = new ProductItemDb(x);
    
                        cdb.save((cerr: any) => {
                            if(cerr) error += 'Ocorreu um erro ao cadastrar o produto com o item\n';
                            else model.productItems?.push(x);
                        });
                    }
                }

                if(error)
                {
                    response.status(400).send({
                        success: false,
                        message: Message.CREATE_ERROR,
                        error: error,
                    });
                    session.abortTransaction();
                }
                else
                {
                    response.status(201).send({ 
                        success: true, 
                        message: Message.CREATE_SUCCESS('Produto'),
                        data: model
                    });
                }
                
            }
        });

        session.endSession();
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldProduct = await ProductDb.findOne({ id });
        
        var model = request.body as Product;
        model.id = oldProduct?.id;
        model.registerDate = oldProduct?.registerDate!;
        model.title = model.title ?? oldProduct?.title;
        model.description = model.description ?? oldProduct?.description;
        model.image = model.image ?? oldProduct?.image;
        model.price = model.price ?? oldProduct?.price;
        model.points = model.points ?? oldProduct?.points;
        
        var categoryProducts = request.body.categoryProducts as CategoryProduct[];
        var productItems = request.body.productItems as ProductItem[];

        ProductDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
            (async (err: any, result: any) => {

            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }
            else
            {
                model.id = id;
                model.categoryProducts = new Array<CategoryProduct>();
                model.productItems = new Array<ProductItem>();

                var ctProd = await CategoryProductDb.find({ productId: id }) as CategoryProduct[];
                var prodItem = await ProductItemDb.find({ productId: id }) as ProductItem[];
                console.log(prodItem);
                var error = '';
                
                if(categoryProducts && categoryProducts !== undefined && categoryProducts.length > 0)
                {
                    for(let x of categoryProducts)
                    {
                        var category = await CategoryDb.findOne({ id: x.categoryId });

                        if(!category)
                        {
                            error += 'Categoria não existe\n';
                            break;
                        }
                        else if(ctProd.filter(y => y.categoryId == x.categoryId && 
                            y.productId == x.productId).length > 0)
                        {
                            model.categoryProducts.push(ctProd.find(y => y.categoryId == x.categoryId && 
                                y.productId == x.productId) as CategoryProduct);
                            ctProd = ctProd.filter(y => y.categoryId != x.categoryId && 
                                y.productId != x.productId);
                            break;
                        }

                        x.productId = model.id;

                        const cdb = new CategoryProductDb(x);

                        cdb.save((cerr: any) => {
                            if(cerr) error += 'Ocorreu um erro ao atualizar o produto com a categoria\n';
                            else model.categoryProducts?.push(x);
                        });
                    }

                    for(let ct of ctProd) 
                    {
                        CategoryProductDb.remove({ id: ct.id }, (err: any) => {
                            if(err)
                                error += err + '\n';
                        });
                    }
                }
                
                if(productItems && productItems !== undefined && productItems.length > 0)
                {
                    for(let x of productItems)
                    {
                        var item = await ItemDb.findOne({ id: x.itemId });

                        if(!item)
                        {
                            error += 'Item não existe\n';
                            break;
                        }
                        else if(prodItem.filter(y => y.itemId == x.itemId && 
                            y.productId == x.productId && y.isDefault == x.isDefault).length > 0)
                        {
                            model.productItems.push(prodItem.find(y => y.itemId == x.itemId && 
                                y.productId == x.productId && y.isDefault == x.isDefault) as ProductItem);
                            prodItem = prodItem.filter(y => y.itemId != x.itemId && 
                                y.productId != x.productId && y.isDefault == x.isDefault);
                            break;
                        }
                        
                        x.productId = model.id;

                        const cdb = new ProductItemDb(x);

                        cdb.save((cerr: any) => {
                            if(cerr) error += 'Ocorreu um erro ao atualizar o produto com o item\n';
                            else model.productItems?.push(x);
                        });
                    }

                    for(let pi of prodItem) 
                    {
                        ProductItemDb.remove({ id: pi.id }, (err: any) => {
                            if(err)
                                error += err + '\n';
                        });
                    }
                }
                
                if(error)
                {
                    response.status(400).send({
                        success: false,
                        message: Message.CREATE_ERROR,
                        error: error,
                    });
                }
                else
                {
                    response.status(200).send({ 
                        success: true, 
                        message: Message.UPDATE_SUCCESS('Produto'),
                        data: model
                    });
                }
            }
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        ProductDb.remove({ id }, (err: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.DELETE_ERROR,
                    error: err
                });
            }
            else
            {
                var error = '';

                CategoryProductDb.remove({ productId: id }, (err: any) => {
                    if(err)
                    {
                        error += err + '\n';
                    }
                });

                ProductItemDb.remove({ productId: id }, (err: any) => {
                    if(err)
                    {
                        error += err + '\n';
                    }
                });

                if(error)
                {
                    response.status(400).send({ 
                        success: false, 
                        message: Message.DELETE_ERROR,
                        error: error
                    });
                }
                else
                {
                    response.status(200).send({ 
                        success: true, 
                        message: Message.DELETE_SUCCESS('Produto')
                    });
                }
            }
        });
    }
}