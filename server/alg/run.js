var Population = require("./population");

var packerStatus = {
  isPackering: false,
  process: 0,
  bestFitness: 0,
  conflicts: [],
  msg: ""
};

var result = {
  isAlgFinished: false,
  packerStatus: packerStatus,
  pop: null
};

process.on('message', function (m) {
  if (!packerStatus.isPackering) {
    packerStatus.isPackering = true;
    packerStatus.msg = "正在排课请";
    packerStatus.process = 0;
    packerStatus.bestFitness = 0;
    result.isAlgFinished = false;
    process.send(result);
    runPackerAlg(m.courseToArrange, m.courseArranged);
  }
});

function runPackerAlg(courseToArrange, courseArranged) {

  var totalGeneNum = 2000;
  var processGeneNum = totalGeneNum / 20;
  var pop = new Population(courseToArrange, courseArranged);
  pop.pConfig.size = 300;
  pop.pConfig.crossoverRate = 0.7;
  pop.pConfig.mutateRate = 0.001;
  pop.initPoputation();

  for (var i = 0; i <= totalGeneNum; i++) {
    pop.evolve();
    if (i % processGeneNum == 0) {
      packerStatus.process = i / totalGeneNum;
      packerStatus.bestFitness = pop.bestFitness;
      process.send(result);
    }
    if (pop.bestFitness == 1) {
      packerStatus.process = 1;
      packerStatus.bestFitness = 1;
      break
    }
  }
  packerStatus.process = 1;
  packerStatus.isPackering = false;
  packerStatus.msg = "排课完成";
  packerStatus.conflicts = pop.bestIndividule.conflicts;
  result.pop = pop;
  result.isAlgFinished = true;
  process.send(result);
}