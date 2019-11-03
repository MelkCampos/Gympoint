import Bee from 'bee-queue';
import NewRegistrationMail from '../app/jobs/NewRegistrationMail';
// import AnswerHelpOrderMail from '../app/jobs/AnswerHelpOrderMail';
import redisConfig from '../config/redis';

const jobs = [NewRegistrationMail];
  
// Criando uma [ fila ] para cada "job".  

class Queue {
  constructor() {
    // filas
    this.queues = {};

    this.init();
  }

  // mapeamento
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle
      };
    });
  }

  // adicionando novo job
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processamento de filas
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }


  handleFailure(job, error) {
    console.log(`Queue ${job.queue.name}: FAILED`, error);
  }
}

export default new Queue();