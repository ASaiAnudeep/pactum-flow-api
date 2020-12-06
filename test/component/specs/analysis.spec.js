const pactum = require('pactum');
const { like } = pactum.matchers;

describe('Analysis - create, get & delete', () => {

  before(async () => {
    this.analysisId = '';
    this.projectId = await pactum.spec()
      .post('/api/pactum/flow/v1/project')
      .withJson({
        "key": "team_login-service",
        "name": "[Team] login-service",
      })
      .expectStatus(200)
      .returns('_id');
  });

  it('create a new analysis', async () => {
    this.analysisId = await pactum.spec()
      .post('/api/pactum/flow/v1/analysis')
      .withJson({
        "projectId": this.projectId,
        "branch": "main",
        "version": "1.0.2",
      })
      .expectStatus(200)
      .expectJsonMatch({
        "_id": like('5fcc58fa26bcf83298099dd5'),
        "branch": "main",
        "version": "1.0.2",
        "createdAt": like('2020-12-06T04:37:08.165Z'),
        "flows": []
      })
      .returns('_id');
  });

  it('get analysis by id', async () => {
    await pactum.spec()
      .get('/api/pactum/flow/v1/analysis/{id}')
      .withPathParams('id', this.analysisId)
      .expectStatus(200)
      .expectJsonMatch({
        "_id": this.analysisId,
        "branch": "main",
        "version": "1.0.2",
        "createdAt": like('2020-12-06T04:37:08.165Z'),
        "flows": []
      });
  });

  it('get analysis', async () => {
    await pactum.spec()
      .get('/api/pactum/flow/v1/analysis')
      .expectStatus(200)
      .expectJsonLike([
        {
          "_id": this.analysisId,
          "branch": "main",
          "version": "1.0.2",
          "flows": []
        }
      ]);
  });

  it('delete an analysis', async () => {
    await pactum.spec()
      .delete('/api/pactum/flow/v1/analysis/{id}')
      .withPathParams('id', this.analysisId)
      .expectStatus(200);
  });

  after(async () => {
    await pactum.spec()
    .delete('/api/pactum/flow/v1/project/{id}')
    .withPathParams('id', this.projectId)
    .expectStatus(200);
  });

});