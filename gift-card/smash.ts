const passwordSelector = "body > flutter-view > flt-text-editing-host > input";

const sheetData = [
  {
    link: "https://loja.smash.gifts/resgatar/0LLluqMIZcLdZwwUoZ6U",
    password: "588285",
  },
  {
    link: "https://loja.smash.gifts/resgatar/0ayzLvwmuhdHhsmbiADz",
    password: "792534",
  },
];

type TaskWrapper<T> = {
  promise: Promise<T>;
  isResolved: boolean;
  result?: T;
  error?: any;
};

type FilteredTasks<T> = {
  resolvedTasks: TaskWrapper<T>[];
  pendingTasks: TaskWrapper<T>[];
};

async function waitForElement(
  window: Window,
  selector: string,
  interval: number = 1000,
  timeout: number = 30000
): Promise<Element> {
  const start = Date.now();
  console.log(`Waiting for element: ${selector}`);
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      const element = window.document.querySelector(selector);
      if (element) {
        clearInterval(checkInterval);
        resolve(element);
      } else if (Date.now() - start >= timeout) {
        clearInterval(checkInterval);
        reject(
          new Error(
            `Element with selector "${selector}" not found within ${timeout} ms`
          )
        );
      }
    }, interval);
  });
}

function separateResolvedAndPendingTasks<T>(
  activeTasks: TaskWrapper<T>[]
): FilteredTasks<T> {
  const resolvedTasks: TaskWrapper<T>[] = [];
  const pendingTasks: TaskWrapper<T>[] = [];
  for (const task of activeTasks) {
    if (task.isResolved) {
      resolvedTasks.push(task);
    } else {
      pendingTasks.push(task);
    }
  }
  return { resolvedTasks, pendingTasks };
}

function handleResolvedTasks<T>(
  activeTasks: TaskWrapper<T>[]
): TaskWrapper<T>[] {
  const { resolvedTasks, pendingTasks } =
    separateResolvedAndPendingTasks(activeTasks);
  resolvedTasks.forEach((task) => {
    if (task.result) {
      console.log("Task resolved with result:", task.result);
    } else if (task.error) {
      console.error("Task resolved with error:", task.error);
    }
  });
  return pendingTasks;
}

function createTaskWrapper<T>(taskPromise: Promise<T>) {
  const taskWrapper: TaskWrapper<T> = {
    promise: taskPromise,
    isResolved: false,
  };
  taskPromise
    .then((result) => {
      taskWrapper.result = result;
    })
    .catch((error) => {
      taskWrapper.error = error;
      console.error("Error processing task:", error);
    })
    .finally(() => {
      taskWrapper.isResolved = true;
    });
  return taskWrapper;
}

async function addTasksUpToParallelLimit<T>(
  activeTasks: TaskWrapper<T>[],
  taskGenerator: AsyncGenerator<() => Promise<T>>,
  parallelLimit: number
): Promise<number> {
  let startedTasks = 0;
  while (activeTasks.length < parallelLimit) {
    const nextTask = await taskGenerator.next();
    if (nextTask.done) {
      break;
    }
    const taskPromise = nextTask.value();
    const taskWrapper = createTaskWrapper(taskPromise);
    activeTasks.push(taskWrapper);
    startedTasks += 1;
  }
  return startedTasks;
}

async function openGiftCardWindow(
  link: string,
  password: string,
  waitInterval: number = 1000,
  elementTimeout: number = 30000
): Promise<string> {
  console.log(`Opening link: ${link}`);
  const newWindow = window.open(link, "_blank");
  if (!newWindow) {
    throw new Error(`Failed to open the new window for link: ${link}`);
  }
  const inputElement = await waitForElement(
    newWindow,
    passwordSelector,
    waitInterval,
    elementTimeout
  );
  if (!inputElement) {
    throw new Error(`Failed to find password selector for link: ${link}`);
  }
  console.log(
    `Password selector found for link: ${link}, password: ${password}`
  );
  return "codeString";
}

async function* taskGeneratorFunction(
  sheetData: Array<{ link: string; password: string }>
) {
  for (const { link, password } of sheetData) {
    yield () => openGiftCardWindow(link, password);
  }
}

async function openLinksFromSheet(
  sheetData: Array<{ link: string; password: string }>,
  maxRows: number = 10,
  parallelLimit: number = 3
): Promise<void> {
  const rowsToProcess = Math.min(sheetData.length, maxRows);
  const taskGenerator = taskGeneratorFunction(
    sheetData.slice(0, rowsToProcess)
  );
  let activeTasks: TaskWrapper<string>[] = [];
  while (true) {
    activeTasks = handleResolvedTasks(activeTasks);
    const result = await addTasksUpToParallelLimit(
      activeTasks,
      taskGenerator,
      parallelLimit
    );
    if (result === 0 && activeTasks.length === 0) {
      break;
    }
  }
  while (activeTasks.length > 0) {
    activeTasks = handleResolvedTasks(activeTasks);
  }
}

javascript: (async function () {
  await openLinksFromSheet(sheetData);
})();
