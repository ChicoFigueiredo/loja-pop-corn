var path, node_ssh, ssh, fs
    // Putting entire directories
const failed = []
const successful = []

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()


ssh.connect({
        host: 'sistema.lojapopcorn.com.br',
        username: 'ubuntu',
        privateKey: 'chico.pem',
        port: 22
    })
    .then(function() {
        ssh.execCommand('rm -Rf *', { cwd: '/var/www/lojaPopCorn/spa/' }).then(function(result) {
            console.log('rm -Rf * STDOUT: ' + result.stdout);
            console.log('rm -Rf * STDERR: ' + result.stderr);

            ssh.putDirectory('../server/spa/', '/var/www/lojaPopCorn/spa/', {
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
                console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
                console.log('failed transfers', failed.join(', '));
                console.log('successful transfers', successful.join(', '));
                ssh.dispose();
            });
        })



    }).then(function() {});