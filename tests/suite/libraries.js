const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const request = require('../base');
const fetch = require('../fetch');
const testCors = require('../cors');
const testHuman = require('../human');

describe('/libraries', () => {
    describe('No query params', () => {
        const path = '/libraries';
        const test = () => request().get(path);
        let response;
        before('fetch endpoint', done => {
            fetch(test, 5000).then(res => {
                response = res;
                done();
            });
        });
        testCors(path, () => response);
        it('returns the correct Cache headers', done => {
            expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
            done();
        });
        it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
            expect(response).to.be.json;
            expect(response.body).to.have.property('results').that.is.an('array');
            expect(response.body).to.have.property('total').that.is.a('number');
            expect(response.body).to.have.property('available').that.is.a('number');
            done();
        });
        it('returns all available hits', done => {
            expect(response.body.results).to.have.lengthOf(response.body.total);
            expect(response.body.results).to.have.lengthOf(response.body.available);
            done();
        });
        describe('Library object', () => {
            it('is an object with \'name\' and \'latest\' properties', done => {
                for (const result of response.body.results) {
                    expect(result).to.have.property('name').that.is.a('string');
                    try {
                        expect(result).to.have.property('latest').that.is.a('string');
                    } catch (_) {
                        expect(result).to.have.property('latest').that.is.null;
                    }
                }
                done();
            });
            it('has a CDN url for the \'latest\' property', done => {
                for (const result of response.body.results) {
                    try {
                        expect(result.latest).to.match(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/.+\/.+\/.*/);
                    } catch (_) {
                        expect(result.latest).to.be.null;
                    }
                }
                done();
            });
            it('has no other properties', done => {
                for (const result of response.body.results) {
                    expect(Object.keys(result)).to.have.lengthOf(2);
                }
                done();
            });
        });
    });

    describe('Requesting human response (?output=human)', () => {
        const path = '/libraries?output=human';
        const test = () => request().get(path);
        let response;
        before('fetch endpoint', done => {
            fetch(test, 5000).then(res => {
                response = res;
                done();
            });
        });
        testCors(path, () => response);
        it('returns the correct Cache headers', done => {
            expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
            done();
        });
        testHuman(() => response);
    });

    describe('Limiting number of results (?limit=10)', () => {
        const path = '/libraries?limit=10';
        const test = () => request().get(path);
        let response;
        before('fetch endpoint', done => {
            fetch(test, 5000).then(res => {
                response = res;
                done();
            });
        });
        testCors(path, () => response);
        it('returns the correct Cache headers', done => {
            expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
            done();
        });
        it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
            expect(response).to.be.json;
            expect(response.body).to.have.property('results').that.is.an('array');
            expect(response.body).to.have.property('total').that.is.a('number');
            expect(response.body).to.have.property('available').that.is.a('number');
            done();
        });
        it('returns only the requested number of hits', done => {
            expect(response.body.results).to.have.lengthOf(10);
            expect(response.body.total).to.equal(10);
            expect(response.body.available).to.be.above(10);
            done();
        });
    });

    describe('Requesting a field (?fields=version)', () => {
        const path = '/libraries?fields=version';
        const test = () => request().get(path);
        let response;
        before('fetch endpoint', done => {
            fetch(test, 5000).then(res => {
                response = res;
                done();
            });
        });
        testCors(path, () => response);
        it('returns the correct Cache headers', done => {
            expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
            done();
        });
        it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
            expect(response).to.be.json;
            expect(response.body).to.have.property('results').that.is.an('array');
            expect(response.body).to.have.property('total').that.is.a('number');
            expect(response.body).to.have.property('available').that.is.a('number');
            done();
        });
        it('returns all available hits', done => {
            expect(response.body.results).to.have.lengthOf(response.body.total);
            expect(response.body.results).to.have.lengthOf(response.body.available);
            done();
        });
        describe('Library object', () => {
            it('is an object with \'name\', \'latest\' and requested \'version\' properties', done => {
                for (const result of response.body.results) {
                    expect(result).to.have.property('name').that.is.a('string');
                    try {
                        expect(result).to.have.property('latest').that.is.a('string');
                    } catch (_) {
                        expect(result).to.have.property('latest').that.is.null;
                    }
                    expect(result).to.have.property('version').that.is.a('string');
                }
                done();
            });
            it('has no other properties', done => {
                for (const result of response.body.results) {
                    expect(Object.keys(result)).to.have.lengthOf(3);
                }
                done();
            });
        });
    });

    describe('Requesting multiple fields', () => {
        describe('through comma-separated string (?fields=filename,version)', () => {
            const path = '/libraries?fields=filename,version';
            const test = () => request().get(path);
            let response;
            before('fetch endpoint', done => {
                fetch(test, 5000).then(res => {
                    response = res;
                    done();
                });
            });
            testCors(path, () => response);
            it('returns the correct Cache headers', done => {
                expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                done();
            });
            it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                expect(response).to.be.json;
                expect(response.body).to.have.property('results').that.is.an('array');
                expect(response.body).to.have.property('total').that.is.a('number');
                expect(response.body).to.have.property('available').that.is.a('number');
                done();
            });
            it('returns all available hits', done => {
                expect(response.body.results).to.have.lengthOf(response.body.total);
                expect(response.body.results).to.have.lengthOf(response.body.available);
                done();
            });
            describe('Library object', () => {
                it('is an object with \'name\', \'latest\' and requested \'filename\' & \'version\' properties', done => {
                    for (const result of response.body.results) {
                        expect(result).to.have.property('name');
                        expect(result).to.have.property('latest');
                        expect(result).to.have.property('filename');
                        expect(result).to.have.property('version');
                    }
                    done();
                });
                it('has no other properties', done => {
                    for (const result of response.body.results) {
                        expect(Object.keys(result)).to.have.lengthOf(4);
                    }
                    done();
                });
            });
        });

        describe('through multiple query parameters (?fields=filename&fields=version)', () => {
            const path = '/libraries?fields=filename&fields=version';
            const test = () => request().get(path);
            let response;
            before('fetch endpoint', done => {
                fetch(test, 5000).then(res => {
                    response = res;
                    done();
                });
            });
            testCors(path, () => response);
            it('returns the correct Cache headers', done => {
                expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                done();
            });
            it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                expect(response).to.be.json;
                expect(response.body).to.have.property('results').that.is.an('array');
                expect(response.body).to.have.property('total').that.is.a('number');
                expect(response.body).to.have.property('available').that.is.a('number');
                done();
            });
            it('returns all available hits', done => {
                expect(response.body.results).to.have.lengthOf(response.body.total);
                expect(response.body.results).to.have.lengthOf(response.body.available);
                done();
            });
            describe('Library object', () => {
                it('is an object with \'name\', \'latest\' and requested \'filename\' & \'version\' properties', done => {
                    for (const result of response.body.results) {
                        expect(result).to.have.property('name');
                        expect(result).to.have.property('latest');
                        expect(result).to.have.property('filename');
                        expect(result).to.have.property('version');
                    }
                    done();
                });
                it('has no other properties', done => {
                    for (const result of response.body.results) {
                        expect(Object.keys(result)).to.have.lengthOf(4);
                    }
                    done();
                });
            });
        });
    });

    describe('Requesting all fields (?fields=*)', () => {
        const path = '/libraries?fields=*';
        const test = () => request().get(path);
        let response;
        before('fetch endpoint', done => {
            fetch(test, 5000).then(res => {
                response = res;
                done();
            });
        });
        testCors(path, () => response);
        it('returns the correct Cache headers', done => {
            expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
            done();
        });
        it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
            expect(response).to.be.json;
            expect(response.body).to.have.property('results').that.is.an('array');
            expect(response.body).to.have.property('total').that.is.a('number');
            expect(response.body).to.have.property('available').that.is.a('number');
            done();
        });
        it('returns all available hits', done => {
            expect(response.body.results).to.have.lengthOf(response.body.total);
            expect(response.body.results).to.have.lengthOf(response.body.available);
            done();
        });
        describe('Library object', () => {
            it('is an object with the full set of library properties', done => {
                for (const result of response.body.results) {
                    expect(result).to.have.property('name').that.is.a('string');
                    try {
                        expect(result).to.have.property('latest').that.is.a('string');
                    } catch (_) {
                        expect(result).to.have.property('latest').that.is.null;
                    }
                    expect(result).to.have.property('filename').that.is.a('string');
                    expect(result).to.have.property('description').that.is.a('string');
                    expect(result).to.have.property('version').that.is.a('string');
                    try {
                        expect(result).to.have.property('keywords').that.is.an('array');
                    } catch (_) {
                        expect(result).to.have.property('keywords').that.is.null;
                    }
                    expect(result).to.have.property('alternativeNames').that.is.an('array');
                    expect(result).to.have.property('fileType').that.is.a('string');
                    try {
                        expect(result).to.have.property('github').that.is.an('object');
                    } catch (_) {
                        expect(result).to.have.property('github').that.is.null;
                    }
                    expect(result).to.have.property('license').that.is.a('string');
                    expect(result).to.have.property('homepage').that.is.a('string');
                    try {
                        expect(result).to.have.property('repository').that.is.an('object');
                    } catch (_) {
                        expect(result).to.have.property('repository').that.is.null;
                    }
                    expect(result).to.have.property('author').that.is.a('string');
                    expect(result).to.have.property('originalName').that.is.a('string');
                    expect(result).to.have.property('sri').that.is.a('string');
                    expect(result).to.have.property('objectID').that.is.a('string');
                }
                done();
            });
        });
    });

    describe('Searching for libraries', () => {
        // This set of tests is incredibly fragile
        // Testing of the searching functionality should be done by hand
        // TODO: Make this set of tests more robust

        describe('Providing a short query (?search=twitter-bootstrap)', () => {
            const path = '/libraries?search=twitter-bootstrap';
            const test = () => request().get(path);
            let response;
            before('fetch endpoint', done => {
                fetch(test, 5000).then(res => {
                    response = res;
                    done();
                });
            });
            testCors(path, () => response);
            it('returns the correct Cache headers', done => {
                expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                done();
            });
            it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                expect(response).to.be.json;
                expect(response.body).to.have.property('results').that.is.an('array');
                expect(response.body).to.have.property('total').that.is.a('number');
                expect(response.body).to.have.property('available').that.is.a('number');
                done();
            });
            it('returns all available hits', done => {
                expect(response.body.results).to.have.lengthOf(response.body.total);
                expect(response.body.results).to.have.lengthOf(response.body.available);
                done();
            });
            describe('Library object', () => {
                it('returns the \'twitter-bootstrap\' package as the first object', done => {
                    expect(response.body.results[0]).to.have.property('name', 'twitter-bootstrap');
                    done();
                });
                it('is an object with \'name\' and \'latest\' properties', done => {
                    for (const result of response.body.results) {
                        expect(result).to.have.property('name').that.is.a('string');
                        expect(result).to.have.property('latest').that.is.a('string');
                    }
                    done();
                });
                it('has no other properties', done => {
                    for (const result of response.body.results) {
                        expect(Object.keys(result)).to.have.lengthOf(2);
                    }
                    done();
                });
            });
        });

        describe('Providing a query that is longer than max that Algolia allows (?search=this-is-a-very-very-long-query-that-algolia-wont-like-and-will-return-an-error-for-as-it-is-longer-that-512-chars-which-is-documented-on-their-website-on-the-query-api-parameters-page-in-the-usage-notes-section-now-i-shall-repeat-this-as-it-isnt-quite-long-enough-to-cause-that-error-yet-this-is-a-very-very-long-query-that-algolia-wont-like-and-will-return-an-error-for-as-it-is-longer-that-512-chars-which-is-documented-on-their-website-on-the-query-api-parameters-page-in-the-usage-notes-section-now-i-shall-repeat-this-as-it-isnt-quite-long-enough-to-cause-that-error-yet)', () => {
            const path = '/libraries?search=this-is-a-very-very-long-query-that-algolia-wont-like-and-will-return-an-error-for-as-it-is-longer-that-512-chars-which-is-documented-on-their-website-on-the-query-api-parameters-page-in-the-usage-notes-section-now-i-shall-repeat-this-as-it-isnt-quite-long-enough-to-cause-that-error-yet-this-is-a-very-very-long-query-that-algolia-wont-like-and-will-return-an-error-for-as-it-is-longer-that-512-chars-which-is-documented-on-their-website-on-the-query-api-parameters-page-in-the-usage-notes-section-now-i-shall-repeat-this-as-it-isnt-quite-long-enough-to-cause-that-error-yet';
            const test = () => request().get(path);
            let response;
            before('fetch endpoint', done => {
                fetch(test, 5000).then(res => {
                    response = res;
                    done();
                });
            });
            testCors(path, () => response);
            it('returns the correct Cache headers', done => {
                expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                done();
            });
            it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                expect(response).to.be.json;
                expect(response.body).to.have.property('results').that.is.an('array');
                expect(response.body).to.have.property('total').that.is.a('number');
                expect(response.body).to.have.property('available').that.is.a('number');
                done();
            });
            it('returns all available hits', done => {
                expect(response.body.results).to.have.lengthOf(response.body.total);
                expect(response.body.results).to.have.lengthOf(response.body.available);
                done();
            });
            // No library object as it's rather likely this won't match anything
            // But this test is just to ensure it doesn't return an error
        });
    });

    describe('Searching for libraries with specific fields', () => {
        // This set of tests is incredibly fragile
        // Testing of the searching functionality should be done by hand
        // TODO: Make this set of tests more robust


        describe('Providing search fields that are valid', () => {
            describe('through comma-separated string (?search=backbone.js&search_fields=keywords,github.user)', () => {
                const path = '/libraries?search=backbone.js&search_fields=keywords,github.user';
                const test = () => request().get(path);
                let response;
                before('fetch endpoint', done => {
                    fetch(test, 5000).then(res => {
                        response = res;
                        done();
                    });
                });
                testCors(path, () => response);
                it('returns the correct Cache headers', done => {
                    expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                    done();
                });
                it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                    expect(response).to.be.json;
                    expect(response.body).to.have.property('results').that.is.an('array');
                    expect(response.body).to.have.property('total').that.is.a('number');
                    expect(response.body).to.have.property('available').that.is.a('number');
                    done();
                });
                it('returns all available hits', done => {
                    expect(response.body.results).to.have.lengthOf(response.body.total);
                    expect(response.body.results).to.have.lengthOf(response.body.available);
                    done();
                });
                describe('Library object', () => {
                    it('is an object with \'name\' and \'latest\' properties', done => {
                        for (const result of response.body.results) {
                            expect(result).to.have.property('name').that.is.a('string');
                            expect(result).to.have.property('latest').that.is.a('string');
                        }
                        done();
                    });
                    // This is fragile!
                    // backbone.js doesn't have a keyword for itself and is owned by a user so we shouldn't see it
                    it('doesn\'t return the \'backbone.js\' package', done => {
                        for (const result of response.body.results) {
                            expect(result.name).to.not.equal('backbone.js');
                        }
                        done();
                    });
                    it('has no other properties', done => {
                        for (const result of response.body.results) {
                            expect(Object.keys(result)).to.have.lengthOf(2);
                        }
                        done();
                    });
                });
            });

            describe('through multiple query parameters (?search=backbone.js&search_fields=keywords&search_fields=github.user)', () => {
                const path = '/libraries?search=backbone.js&search_fields=keywords&search_fields=github.user';
                const test = () => request().get(path);
                let response;
                before('fetch endpoint', done => {
                    fetch(test, 5000).then(res => {
                        response = res;
                        done();
                    });
                });
                testCors(path, () => response);
                it('returns the correct Cache headers', done => {
                    expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                    done();
                });
                it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                    expect(response).to.be.json;
                    expect(response.body).to.have.property('results').that.is.an('array');
                    expect(response.body).to.have.property('total').that.is.a('number');
                    expect(response.body).to.have.property('available').that.is.a('number');
                    done();
                });
                it('returns all available hits', done => {
                    expect(response.body.results).to.have.lengthOf(response.body.total);
                    expect(response.body.results).to.have.lengthOf(response.body.available);
                    done();
                });
                describe('Library object', () => {
                    it('is an object with \'name\' and \'latest\' properties', done => {
                        for (const result of response.body.results) {
                            expect(result).to.have.property('name').that.is.a('string');
                            expect(result).to.have.property('latest').that.is.a('string');
                        }
                        done();
                    });
                    // This is fragile!
                    // backbone.js doesn't have a keyword for itself and is owned by a user so we shouldn't see it
                    it('doesn\'t return the \'backbone.js\' package', done => {
                        for (const result of response.body.results) {
                            expect(result.name).to.not.equal('backbone.js');
                        }
                        done();
                    });
                    it('has no other properties', done => {
                        for (const result of response.body.results) {
                            expect(Object.keys(result)).to.have.lengthOf(2);
                        }
                        done();
                    });
                });
            });
        });

        describe('Providing search fields that are invalid (?search=backbone.js&search_fields=this-field-doesnt-exist)', () => {
            // If invalid fields make it to Aloglia, it will error, so this tests that we're filtering them first
            const path = '/libraries?search=backbone.js&search_fields=this-field-doesnt-exist';
            const test = () => request().get(path);
            let response;
            before('fetch endpoint', done => {
                fetch(test, 5000).then(res => {
                    response = res;
                    done();
                });
            });
            testCors(path, () => response);
            it('returns the correct Cache headers', done => {
                expect(response).to.have.header('Cache-Control', 'public, max-age=21600'); // Six hours
                done();
            });
            it('returns a JSON body with \'results\', \'total\' and \'available\' properties', done => {
                expect(response).to.be.json;
                expect(response.body).to.have.property('results').that.is.an('array');
                expect(response.body).to.have.property('total').that.is.a('number');
                expect(response.body).to.have.property('available').that.is.a('number');
                done();
            });
            it('returns all available hits', done => {
                expect(response.body.results).to.have.lengthOf(response.body.total);
                expect(response.body.results).to.have.lengthOf(response.body.available);
                done();
            });
            describe('Library object', () => {
                it('is an object with \'name\' and \'latest\' properties', done => {
                    for (const result of response.body.results) {
                        expect(result).to.have.property('name').that.is.a('string');
                        expect(result).to.have.property('latest').that.is.a('string');
                    }
                    done();
                });
                // This is fragile! backbone.js is the most popular package in this query so we should see it first
                it('returns the \'backbone.js\' package as the first object', done => {
                    expect(response.body.results[0]).to.have.property('name', 'backbone.js');
                    done();
                });
                it('has no other properties', done => {
                    for (const result of response.body.results) {
                        expect(Object.keys(result)).to.have.lengthOf(2);
                    }
                    done();
                });
            });
        });
    });
});
