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
        const cmd = spawn('helm', 'init --upgrade --service-account=tiller'.split(' '),{
            stdio: [process.stdin, process.stdout, process.stderr]      
        });

        cmd.on('close', () => {
            resolve();
        });
    });
}

function helm_dependency_build(){
    return new Promise((resolve, reject) => {
        const cmd = spawn('helm', ['dependency', 'build', pathResover.helmChartPath()],{
            stdio: [process.stdin, process.stdout, process.stderr]      
        });

        cmd.on('close', () => {
            resolve();
        });
    });
}

function helm_install(){

    return new Promise((resolve, reject) => {
        console.log('Installing charts... it might take a while...')
        const cmd = spawn('helm', ['install', pathResover.helmChartPath()],{
            stdio: [process.stdin, process.stdout, process.stderr]      
        });
    
        cmd.on('close', () => {
            resolve();
        });
    });
}

async function hook_add_repo() {
    return new Promise((resolve, reject) => {

        if (!process.env.HELMOS_HOOK_ADD_REPO__NAME || !process.env.HELMOS_HOOK_ADD_REPO__URL) {
            return resolve();
        }

        console.log('hooking repo ...');
        console.log(`helm repo add ${process.env.HELMOS_HOOK_ADD_REPO__NAME} ${process.env.HELMOS_HOOK_ADD_REPO__URL}`);
        const cmd = spawn('helm', `repo add ${process.env.HELMOS_HOOK_ADD_REPO__NAME} ${process.env.HELMOS_HOOK_ADD_REPO__URL}`.split(' '),{
            stdio: [process.stdin, process.stdout, process.stderr]      
        });
    
        cmd.on('close', () => {
            resolve();
        });
    });
}


async function run() {
    await pre_helm();
    await helm_init();
    await hook_add_repo();
    await helm_dependency_build();
    await helm_install();
}

run();