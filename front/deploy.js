var path, node_ssh, ssh, fs
    // Putting entire directories
const failed = []
const successful = []

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()


const HOST_URL = 'admin.academiabancaria.com.br';
const REMOTE_DIR = '/var/www/admin-cl-beneficios/';
const LOCAL_DIR = '../admin-server/spa/';

ssh.connect({
        host: HOST_URL,
        username: 'ubuntu',
        privateKey: 'chico.pem',
        port: 22
    })
    .then(function() {
        console.log("\n\n****************************************************************************");
        const cmd1 = 'rm -Rfv *';
        console.log("executando: " + cmd1 + "\n");
        ssh.execCommand(cmd1, { cwd: REMOTE_DIR + 'spa/' }).then(function(result) {
            console.log(cmd1 + ' STDOUT: \n' + result.stdout);
            console.log('');
            console.log(cmd1 + ' STDERR: \n' + result.stderr);
            console.log("\n\n****************************************************************************");
            console.log("executando: scp dir \n\n");
            ssh.putDirectory(LOCAL_DIR, REMOTE_DIR + 'spa/', {
                recursive: true,
                concurrency: 10,
                validate: function(itemPath) {
                    const baseName = path.basename(itemPath)
                    return baseName.substr(0, 1) !== '.' && // do not allow dot files
                        baseName !== 'node_modules' // do not allow node_modules
                },
                tick: function(localPath, remotePath, error) {
                    if (error) {
                        failed.push(localPath)
                        console.log(localPath + ' failed');
                    } else {
                        successful.push(localPath)
                        console.log(localPath + ' up');
                    }
                }
            }).then(function(status) {
                console.log("\n\n-------------------------------------------------------------------------------");
                console.log('*  the directory transfer was ', status ? 'successful' : 'unsuccessful');
                console.log('*  failed transfers: ', failed.join(', '));
                console.log('*  successful transfers: ', successful.join(', '));
                ssh.dispose();
            });
        })
    }).then(function() {});