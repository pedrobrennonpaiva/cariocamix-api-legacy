import { Base } from "./base/Base";
import { Store } from "./Store";
import { v4 as uuid } from 'uuid';

export class StoreDayHour extends Base {

    storeId: string = uuid();

    store: Store | null = null;

    dayOfWeek: number;

    hourOpen: string;

    hourClose: string;
}
