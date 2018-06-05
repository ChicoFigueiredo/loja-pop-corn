var path, node_ssh, ssh, fs
    // Putting entire directories
const failed = []
const successful = []

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
const { exec, execSync } = require('child_process');
ssh = new node_ssh()


const HOST_URL = 'ssh.ultraposgraduacao.com.br';
const REMOTE_DIR = '/var/www/ultra-pos/';
const LOCAL_DIR_CLEAR = './sessions';
const PM2_ID = 'all';
const USER = 'root';
const PSW = 'UltraPosGraduacao-Cursos2018'; // 'h5Y*Wff*dpDbmtUx'; 
const FILE_KEY = '../config/ti.pem';


var tmp = require('tmp');

var tmpZip = 'zzzTmp.zip';
console.log('ziping in file: ', tmpZip);

const zipCmd = "zip.exe -9  -x node_modules/* -r \"" + tmpZip + "\" *";
exec(zipCmd, (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        return "??" + err;
    }
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    ssh.connect({
            host: HOST_URL,
            username: USER,
            //privateKey: FILE_KEY,
            password: PSW,
            port: 22
        })
        .then(function() {
            const cmdPm2Stop = "sudo sudo pm2 stop " + PM2_ID + " --update-env";
            console.log("\n\n****************************************************************************");
            console.log("executando: " + cmdPm2Stop + "\n");
            ssh.execCommand(cmdPm2Stop, { cwd: REMOTE_DIR }).then(function(result) {
                console.log(cmdPm2Stop + ' STDOUT: \n' + result.stdout);
                console.log('');
                console.log(cmdPm2Stop + ' STDERR: \n' + result.stderr);

                console.log("\n\n****************************************************************************");
                const cmdRmFiles = 'sudo sudo sudo rm -Rfv *';
                console.log("executando: " + cmdRmFiles + "\n");
                ssh.execCommand(cmdRmFiles, { cwd: REMOTE_DIR }).then(function(result) {
                    console.log(cmdRmFiles + ' STDOUT: \n' + result.stdout);
                    console.log('');
                    console.log(cmdRmFiles + ' STDERR: \n' + result.stderr);
                    console.log("\n\n****************************************************************************");
                    console.log("executando: scp " + tmpZip + " \n\n");

                    ssh.putFile(tmpZip, REMOTE_DIR + tmpZip).then(function() {
                        console.log(tmpZip + " > UP")

                        const cmdUnzip = "sudo unzip -o " + tmpZip
                        console.log("\n\n****************************************************************************");
                        console.log("executando: " + cmdUnzip + "\n");
                        ssh.execCommand(cmdUnzip, { cwd: REMOTE_DIR }).then(function(result) {
                            console.log(cmdUnzip + ' STDOUT: \n' + result.stdout);
                            console.log(cmdUnzip + ' STDERR: \n' + result.stderr);

                            const cmdNpm = "sudo sudo sudo npm install "; // criando camadas sudo para poder rodar npm install
                            console.log("\n\n****************************************************************************");
                            console.log("executando: " + cmdNpm + "\n");
                            ssh.execCommand(cmdNpm, { cwd: REMOTE_DIR }).then(function(result) {
                                console.log(cmdNpm + ' STDOUT: \n' + result.stdout);
                                console.log(cmdNpm + ' STDERR: \n' + result.stderr);

                                const cmdPm2Restart = "sudo pm2 restart " + PM2_ID + " --update-env";
                                console.log("\n\n****************************************************************************");
                                console.log("executando: " + cmdPm2Restart + "\n");
                                ssh.execCommand(cmdPm2Restart, { cwd: REMOTE_DIR }).then(function(result) {
                                    console.log(cmdPm2Restart + ' STDOUT: \n' + result.stdout);
                                    console.log(cmdPm2Restart + ' STDERR: \n' + result.stderr);

                                    const cmdRmZip = "rm " + tmpZip;
                                    console.log("\n\n****************************************************************************");
                                    console.log("executando: " + cmdRmZip + "\n");
                                    ssh.execCommand(cmdRmZip, { cwd: REMOTE_DIR }).then(function(result) {
                                        console.log(cmdRmZip + ' STDOUT: \n' + result.stdout);
                                        console.log(cmdRmZip + ' STDERR: \n' + result.stderr);

                                        console.log("deletando " + tmpZip);
                                        fs.unlink(tmpZip)
                                        ssh.dispose();
                                    });
                                });
                            });
                        });
                    }, function(error) {
                        console.log("Something's wrong")
                        console.log(error)
                    })
                })
            });
        }).then(function() {});
});