import elasticsearch from 'elasticsearch';

const elasticClient = new elasticsearch.Client({
    host: 'lbass:lbass81@localhost:9200/',
    log: 'debug'
});

class EsClient {
    static findOne(index, type, param, func) {
        let result = elasticClient.search({
                index: index,
                type: type,
                body: {
                    query: {
                            match: param
                        }
                    }
                },
                function (error, response) {
                    //오류 발생 시 실행
                    if(error) func.call(this, error);

                    if(response && response.hits && response.hits.total > 0) {
                        if(response.hits.total > 1) {
                            func.call(this, 'Result is not a one document!');
                        } else {
                            func.call(this, undefined, response.hits.hits[0]._source);
                        }
                    } else {
                        func.call(this, undefined, null);
                    }
                });
    }

    static getCount(index, type, func) {
        let result = elasticClient.count({
                index: index,
                type: type,
                size: 1,
                sort: {
                    'timestamp': 'desc'
                }
            },
            function (error, response) {
                if(error) func.call(this, error);
                func.call(this, undefined, response.count);
            }
        );
    }

    static save(index, type, id, param, func) {
        elasticClient.create({
            index: index,
            type: type,
            body: param,
            id: id
        }, function (error, response) {
            if(error) func.call(this, error);
            func.call(this, undefined) ;
        });
    }

    static esAliveCheck() {
        elasticClient.ping({ requestTimeout: 30000, },
            function (error) {
                if (error) {
                    console.error('elasticsearch cluster is down!');
                } else {
                    console.log('All is well');
                }
            }
        );
    }

    static createIndex() {
        let result = elasticClient.create({
            index: 'testindex',
            type: 'testtype',
            id: '1',
            body: {
                title: 'Test 1',
                tags: ['y', 'z'],
                published: true,
                published_at: '2013-01-01',
                counter: 1
            }
        }, function (error, response) {
            console.info(error);
        });
        console.info(result);
    }
}

export default EsClient;
