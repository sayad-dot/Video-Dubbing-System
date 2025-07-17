class Job {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.type = data.type || 'srt-processing';
    this.status = data.status || 'pending';
    this.progress = data.progress || 0;
    this.data = data.data || {};
    this.result = data.result || null;
    this.error = data.error || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  generateId() {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateStatus(status, progress = this.progress) {
    this.status = status;
    this.progress = progress;
    this.updatedAt = new Date();
  }

  setResult(result) {
    this.result = result;
    this.status = 'completed';
    this.progress = 100;
    this.updatedAt = new Date();
  }

  setError(error) {
    this.error = error;
    this.status = 'failed';
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      progress: this.progress,
      data: this.data,
      result: this.result,
      error: this.error,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Job;
