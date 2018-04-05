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
        port: 22,
        onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
            console.log(prompts[0].prompt);
        }
    })
    .then(function() {
        ssh.putDirectory('./', '/var/www/lojaPopCorn/', {
            recursive: true,
            concurrency: 10,
            validate: function(itemPath) {
                const baseName = path.basename(itemPath).toLowerCase();
                return baseName.substr(0, 1) !== '.' && // do not allow dot files
                    baseName !== 'node_modules' && // do not allow node_modules
                    baseName !== 'deploy.js'
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
            console.log("\n\n****************************************************************************");
            console.log('*  the directory transfer was ', status ? 'successful' : 'unsuccessful');
            console.log('*  failed transfers: ', failed.join(', '));
            console.log('*  successful transfers: ', successful.join(', '));
            console.log("\n\n----------------------------------------------------------------------------");
            const cmd1 = "sudo npm install";
            console.log("executando: " + cmd1 + "\n");
            ssh.execCommand(cmd1, { cwd: '/var/www/lojaPopCorn/' }).then(function(result) {
                console.log(cmd1 + ' STDOUT: ' + result.stdout);
                console.log('');
                console.log(cmd1 + ' STDERR: ' + result.stderr);
                console.log("\n\n----------------------------------------------------------------------------");
                const cmd2 = "sudo pm2 restart www --update-env";
                console.log("executando: " + cmd2 + "\n");
                ssh.execCommand(cmd2, { cwd: '/var/www/lojaPopCorn/' }).then(function(result) {
                    console.log(cmd2 + ' STDOUT: \n' + result.stdout);
                    console.log(cmd2 + ' STDERR: \n' + result.stderr);
                    ssh.dispose();
                });
            });
        });
    }).then(function() {});