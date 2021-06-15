const child_process = require("child_process"),
  os = require("os"),
  EventEmitter = require("events"),
  BdpTaskAdapter = require("@big-data-processor/task-adapter-base");

class BdpLocalAdapter extends BdpTaskAdapter {
  constructor(opt) {
    opt.adapterName = "Local";
    opt.adapterAuthor = "Chi Yang: chiyang1118@gmail.com";
    super(opt);
    this.userInfo = os.userInfo();
    this.options.stdoeMode = "pipe";
  }
  async jobDeploy(jobObj) {
    const jobEmitter = new EventEmitter();
    const RunningProcess = child_process.spawn(jobObj.exec, jobObj.args, {
      cwd: jobObj.option.cwd || this.options.cwd || process.cwd(),
      shell: true,
      env: process.env
    });
    RunningProcess.on("exit", (code, signal) => this.emitJobStatus(jobObj.jobId, code, signal));
    return {
      runningJobId: RunningProcess.pid,
      stdoutStream: RunningProcess.stdout,
      stderrStream: RunningProcess.stderr,
      jobEmitter: jobEmitter,
      isRunning: true
    };
  }
}
module.exports = BdpLocalAdapter;
