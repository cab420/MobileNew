export const CreateDate = () => {
    const day = new Date().getDate() 
    var month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    if (month != 10 && month != 11 && month != 12) {
      month = `0${month}`
    }
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
      }
    if (hours < 10) {
        hours = `0${hours}`
    }
    const time = hours + ':' + minutes;
    const date = day + '-' + month + '-' + year + ' ' + time;
    return date;
}