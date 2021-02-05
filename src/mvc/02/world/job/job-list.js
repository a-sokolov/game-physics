export class JobList {
  constructor() {
    this.jobs = []
  }

  addJob(job) {
    this.jobs.push(job)
  }

  removeJob(job) {
    this.jobs = this.jobs.filter(toRemove => toRemove !== job)
  }

  findJob(callback) {
    return this.jobs.find(callback)
  }

  update() {
    this.jobs.forEach(job => job.run())
  }
}