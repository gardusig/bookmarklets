type Task<OutputData> = {
  promise: Promise<OutputData>;
  isResolved: boolean;
  result?: OutputData;
  error?: any;
};

type ExecutableFunction<InputData, OutputData> = (
  input: InputData
) => Promise<OutputData>;

export function executeTasksInParallel<InputData, OutputData>(
  inputList: InputData[],
  executableFunction: ExecutableFunction<InputData, OutputData>,
  parallelLimit: number = 3
) {
  const taskGenerator = createTaskGenerator(inputList, executableFunction);
  let activeTasks: Task<OutputData>[] = [];
  while (true) {
    activeTasks = filterActiveTasks(activeTasks);
    const result = enqueueTasksUntilLimit(
      activeTasks,
      taskGenerator,
      parallelLimit
    );
    if (result === 0 && activeTasks.length === 0) {
      break;
    }
  }
  while (activeTasks.length > 0) {
    activeTasks = filterActiveTasks(activeTasks);
  }
}

function filterActiveTasks<OutputData>(
  tasks: Task<OutputData>[]
): Task<OutputData>[] {
  const activeTasks: Task<OutputData>[] = [];
  for (const task of tasks) {
    if (!task.isResolved) {
      activeTasks.push(task);
      continue;
    }
    if (task.error) {
      console.error("Task resolved with error:", task.error);
      continue;
    }
    if (task.result) {
      console.log("Task resolved with result:", task.result);
      continue;
    }
  }
  return activeTasks;
}

function createTask<InputData, OutputData>(
  inputData: InputData,
  executableFunction: ExecutableFunction<InputData, OutputData>
): Task<OutputData> {
  const taskPromise = executableFunction(inputData);
  const task: Task<OutputData> = {
    promise: taskPromise,
    isResolved: false,
  };
  taskPromise
    .then((result) => {
      task.result = result;
    })
    .catch((error) => {
      task.error = error;
    })
    .finally(() => {
      task.isResolved = true;
    });
  return task;
}

function enqueueTasksUntilLimit<OutputData>(
  activeTasks: Task<OutputData>[],
  taskGenerator: Generator<Task<OutputData>>,
  parallelLimit: number
): number {
  let startedTasks = 0;
  while (activeTasks.length < parallelLimit) {
    const nextTask = taskGenerator.next();
    if (nextTask.done) {
      break;
    }
    activeTasks.push(nextTask.value);
    startedTasks += 1;
  }
  return startedTasks;
}

function* createTaskGenerator<InputData, OutputData>(
  inputDataList: InputData[],
  executableFunction: ExecutableFunction<InputData, OutputData>
): Generator<Task<OutputData>> {
  for (const inputData of inputDataList) {
    yield createTask(inputData, executableFunction);
  }
}
