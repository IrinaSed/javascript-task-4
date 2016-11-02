'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

function sortOperations(operations) {
    var orderOperations = ['filterIn', 'and', 'or', 'sortBy', 'select', 'format', 'limit'];

    return operations.sort(function (a, b) {
        return orderOperations.indexOf(a.name) - orderOperations.indexOf(b.name);
    });
}


/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {

    var copiedСollection = collection.map(function (friend) {
        return Object.assign({}, friend);
    });
    var queryFunctions = sortOperations([].slice.call(arguments, 1));
    queryFunctions.forEach(function (queryFunction) {
        copiedСollection = queryFunction(copiedСollection);
    });

    return copiedСollection;
};

/*
 * Выбор полей
 * @params {...String}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        return collection.slice().map(function (friend) {
            return fields.reduce(function (selectedRecord, field) {
                if (field in friend) {
                    selectedRecord[field] = friend[field];
                }

                return selectedRecord;
            }, {});
        });
    };
};

/*
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 */

exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        return collection.slice().filter(function (friend) {
            return values.indexOf(friend[property]) !== -1;

        });
    };
};

/*
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        return collection.slice().sort(function (a, b) {
            if (order === 'asc') {
                return a[property] <= b[property] ? -1 : 1;
            }

            return b[property] <= a[property] ? 1 : -1;
        });
    };
};

/*
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 */
exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {
        return collection.slice().map(function (friend) {
            friend[property] = formatter(friend[property]);

            return friend;
        });
    };
};

/*
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 */
exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {
        return collection.slice().slice(0, count);
    };
};

if (exports.isStar) {

    /*
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        var filterFunctions = [].slice.call(arguments);

        return function or(collection) {
            var orFiltered = collection.slice();

            return orFiltered.filter(function (item) {
                return filterFunctions.some(function (filterFunction) {
                    return filterFunction(orFiltered).indexOf(item) >= 0;
                });
            });
        };
    };

    /*
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        var filterFunctions = [].slice.call(arguments);

        return function and(collection) {
            var andFiltered = collection.slice();
            filterFunctions.forEach(function (filterFunction) {
                andFiltered = filterFunction(andFiltered);
            });

            return andFiltered;
        };
    };
}
