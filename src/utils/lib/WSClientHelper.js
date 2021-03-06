
//import { TASK_STATUS } from '../../settings/constants';
import { webService } from '../api/webservice';

//module: 'ProjectTask'
//const taskStatusList = Object.values(TASK_STATUS);

/* export const SetRandomValue = (module, updateField, pickList = []) => {

    let recordsCount = 0;
    let updatedCount = 0;

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    const getRandomValue = () => {
        const index = getRandomInt(0, pickList.length);
        return pickList[index];
    }

    let query1ExecutionTime = 0;
    let query2ExecutionTime = 0;
    let executionTimes = [];

    const query1ExecutionStart = new Date().getTime();
    const query = `SELECT * FROM ${module} where projecttaskstatus = null`;
    console.log('query', query);
    webService.doQuery(query).then((result) => {
        query1ExecutionTime = query1ExecutionStart - new Date().getTime();
        recordsCount = result.length;
        const query2ExecutionStart = new Date().getTime();
        result.map(task => {
            task[`${updateField}`] = getRandomValue();
            const individualQueryStart = new Date().getTime();
            webService.doUpdate(`${module}`, task).then((taskRes) => {
                executionTimes.push(individualQueryStart - new Date().getTime());
                updatedCount = taskRes ? updatedCount + 1 : updatedCount;
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
        });
        query2ExecutionTime = query2ExecutionStart - new Date().getTime();

        console.log('Query 1 Execution - Select Query : ', query1ExecutionTime);
        console.log('Query 1 Execution - Update Query : ', query2ExecutionTime);
        console.log('Update Query Execution : ', executionTimes);

        console.log('Total Records : ', recordsCount);
        console.log('Updated Records : ', updatedCount);
    })
    .catch((error) => {
        console.log("Error: ", error)
    })

} */

export const loadModuleFields = async (module) => {
    const modFields = await webService.doDescribe(module);
    return modFields;
}

export const capitalizeText = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

export const dateParser = v => {
    const regexp = /(\d{4})-(\d{2})-(\d{2})/
    let date = new Date(v);

    let match = regexp.exec(date.toISOString());
    if (match === null) return;
    let year = match[1];
    let month = match[2];
    let day = match[3];

    const d = [year, month, day].join("-");
    return d;
  };


