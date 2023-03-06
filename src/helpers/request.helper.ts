import _ from 'lodash';
import { IPaginationParams, ISortByParams } from '../controllers/types';

export class RequestHelper {
    static parsePaginationParams(paginationParams: IPaginationParams) {
        const offset = paginationParams.offset ? Number(paginationParams.offset) : 0;
        const limit = paginationParams.limit ? Number(paginationParams.limit) : null;
        return {
            offset,
            limit,
        };
    }

    /**
     * sortBy query param should be defined as name:DESC,age:ASC
     */
    static parseSortByParams(sortByParams: ISortByParams) {
        const sortByString = sortByParams.sortBy || '';
        const sortBy = sortByString.split(',').reduce((sortingObject: any, sortItem: string) => {
            const [field, sortType] = sortItem.trim().split(':');
            if (field) {
                let sortOrder = -1;
                if (['ASC', 'DESC'].includes(sortType) && sortType === 'ASC') {
                    sortOrder = 1;
                }
                // eslint-disable-next-line no-param-reassign
                sortingObject[field] = sortOrder;
            }
            return sortingObject;
        }, {});
        return !_.isEmpty(sortBy) ? sortBy : null;
    }
}
