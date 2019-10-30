const { spawn } = require('child_process');
const pathResover = require('./path_resolver')

function pre_helm(){

    return new Promise((resolve, reject) => { 
        console.log('creating tiller pre requesites on cluster...')

        const tiller_prereq = pathResover.templatePath('tiller.yaml');
        const cmd = spawn('kubectl', `apply -f ${tiller_prereq}`.split(' '),{
            stdio: [process.stdin, process.stdout, process.stderr]      
        });
    
        cmd.on('close', () => {
            resolve()
        });
    });
}

function helm_init(){
    return new Promise((resolve, reject) => {
        const cmd = spawn('helm', 'init --upgrade --service-account=tiller'.split(' '));

        cmd.on('close', () => {
            resolve();
        });
    });
}

function helm_dependency_build(){
    return new Promise((resolve, reject) => {
        const cmd = spawn('helm', ['dependency', 'build', pathResover.helmChartPath()]);

        cmd.on('close', () => {
            resolve();
        });
    });
}

function helm_install(){

    return new Promise((resolve, reject) => {
        console.log('Installing charts... it might take a while...')
        const cmd = spawn('helm', ['install', pathResover.helmChartPath()]);
    
        cmd.on('close', () => {
            resolve();
        });
    });
}

await pre_helm().
    then(helm_init()).
    then(helm_dependency_build()).
    then(helm_install())