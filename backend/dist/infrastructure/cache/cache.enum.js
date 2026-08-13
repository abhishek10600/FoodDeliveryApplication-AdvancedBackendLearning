export var CacheOperation;
(function (CacheOperation) {
    CacheOperation["GET"] = "GET";
    CacheOperation["SET"] = "SET";
    CacheOperation["DELETE"] = "DELETE";
    CacheOperation["EXISTS"] = "EXISTS";
    CacheOperation["EXPIRE"] = "EXPIRE";
    CacheOperation["INCREMENT"] = "INCREMENT";
})(CacheOperation || (CacheOperation = {}));
