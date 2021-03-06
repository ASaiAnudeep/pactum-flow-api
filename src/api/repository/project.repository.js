const Project = require('../models/project.model');

class ProjectRepository {

  get(query) {
    return Project.find(query);
  }

  getById(_id) {
    return Project.findById({ _id });
  }

  async save(data) {
    const project = new Project(data);
    const doc = await project.save();
    return doc;
  }

  delete(id) {
    return Project.deleteOne({ _id: id });
  }

}

module.exports = ProjectRepository;