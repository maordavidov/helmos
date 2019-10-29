const path = require('path');

module.exports = {
    /**
     * 
     * @param {string[]} [sub]
     */
    templatePath: function(...sub){ 
        const thePath = path.join(__dirname, "assets", "templates");
        return sub ? path.join(thePath, ...sub) : thePath
    },
    helmChartPath: function() {
        if(process.env.HELM_CHART_PATH){
            return process.env.HELM_CHART_PATH
        }

        throw new Error('missing env variable HELM_CHART_PATH')
    } 

}