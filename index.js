#!/usr/bin/env node

// Imports
const fs = require("fs");
const process = require("process");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// VARS
const fileExtensions = ["js", "ts", "jsx", "tsx", "html"];
const tasks = [];
const prompt = `
You are documentation content writer, write a content for the code below, identify it's programming language! Use MARKDOWN FORMAT for writing and reply only with documentation content. Make sure to add all crisp details and try to add examples, api docs, purpose and other important details (if there)! Make the best use of code to write content!! In markdown format
### also add tips, notes, warnings between sections if there
## Also add small & precise h1 heading (#) in top of page according to code mentioned below, and description below! And further content
`;

// Get parsed Arguments
const args = process.argv.slice(2);
const folderName = args[0];
const aiKey = args[1];
const req = args.slice(2,-1).join(" ");

// CHECK folder
if (!fs.existsSync(folderName)) {
  console.error(`\n🛑 Folder not mentioned or does not exist! 🛑\n`);
  process.exit(1);
}
// CHECK open ai key
if (!aiKey) {
  console.error(`\n🛑 Open AI Key not mentioned! 🛑\n`);
  process.exit(1);
}

// CREATE ai client
const genAI = new GoogleGenerativeAI(aiKey);
const ai = genAI.getGenerativeModel({ model: "gemini-pro" });

console.log(`\n💬 AI Client Created!`);

// INITIATE process main
console.log(
  `\n📁 Getting Files from \` ${
    folderName == "." ? process.cwd() : folderName
  } \` Directory...\n`,
);
getFiles(folderName).forEach((file) => processFile(file));

// Final
console.log(`\n📖 Writing Documents...\n`);
Promise.all(tasks).then(() =>
  console.log(`\n📝 All Tasks Are Proccessed!!...\n`),
);

/**
 * Processes Single File for Further content
 */
function processFile(file) {
  // VARS
  const fileContents = fs.readFileSync(file, "utf8");
  const baseFolder = "docs/";
  const folder = baseFolder + file.split("/").slice(0, -1).join("/");

  // check if node module
  if (file.includes("node_modules")) return;

  // create dir if not there
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  // add task
  tasks.push(
    new Promise(async (resolve, reject) => {
      try {
        // get data
        console.log(`🔖 Generating Content for \` ${file} \` Document...`);
        const data = await generateDocsForFile(fileContents, file);
    if(!data) return;
        // write data
        fs.writeFile(
          baseFolder + file.slice(0, -3) + ".md",
          data,
          (x) => {
            console.log(`🧾 Generated Content for \` ${file} \` Document...`);
            resolve(x);
          },
        );
      } catch (e){console.warn(`\n🛑 System AI Error: ${e.message} 🛑\n`)}
    }),
  );
}

/**
 * Returns Data from OpenAI, as response to file content
 */
async function generateDocsForFile(content, cde) {
  try {
    const result = await ai.generateContent(`${prompt}\n${req ? `Features requested by customer: ${req}\n`:""}Code (Code File - ${cde}):\n${content}`);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (e) {
    console.warn(`\n🛑 AI Error: ${e.message} 🛑\n`)
  }
}

/**
 * Returns all files in specific directory
 */
function getFiles(dir, files = []) {
  // get files
  const filesInDir = fs.readdirSync(dir);
  files = files || [];

  // read each file
  filesInDir.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // recursive
      files = getFiles(fullPath, files);
    } else {
      // check if file is valid
      if (fileExtensions.includes(path.extname(file).replaceAll(".", ""))) {
        files.push(fullPath);
      }
    }
  });
  return files;
}
