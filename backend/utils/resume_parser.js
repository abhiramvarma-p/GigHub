const { spawn } = require('child_process');
const path = require('path');

async function parse_resume(pdf_path) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, 'resume_parser.py');
        const pythonProcess = spawn('python', [pythonScript, pdf_path]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${error}`));
                return;
            }

            try {
                const skills = JSON.parse(result);
                resolve(skills);
            } catch (err) {
                reject(new Error(`Failed to parse Python output: ${err.message}`));
            }
        });
    });
}

module.exports = {
    parse_resume
}; 