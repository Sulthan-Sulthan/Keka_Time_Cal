// function refreshPage() {
//     location.reload();
//   }
function calculateLeaveTime() {
    // Get input value
    const resultt = document.getElementById('result');
    if (resultt.innerHTML){
        resultt.innerHTML ="";
    }
    // if 
    const inHours = parseInt(document.getElementById('inHours').value, 10);
    const inMinutes = parseInt(document.getElementById('inMinutes').value, 10);
    let effectiveHours = parseInt(document.getElementById('effectiveHours').value, 10);
    let effectiveMinutes = parseInt(document.getElementById('effectiveMinutes').value, 10);

    // Check if In-Time fields are empty and display an error if they are
    if (isNaN(inHours) || isNaN(inMinutes) || inHours === "" || inMinutes === "") {
        document.getElementById('result').innerText = 'Please fill in both In-Time hours and minutes.';
        return;
    }

    // If Effective Time fields are empty, assume zero
    if (isNaN(effectiveHours)) effectiveHours = 0;
    if (isNaN(effectiveMinutes)) effectiveMinutes = 0;
    if (isNaN(inMinutes)) inMinutes = 0;
    // Total work time in minutes (8 hours 30 minutes)
    const totalWorkMinutes = 8 * 60 + 30;
    const effectiveMinutesTotal = effectiveHours * 60 + effectiveMinutes;

    const remainingMinutes = totalWorkMinutes - effectiveMinutesTotal;

    if (remainingMinutes < 0) {
        document.getElementById('result').innerText = 'You have already completed your required hours!';
        return;
    }

    // Calculate total minutes for check-out time
    const totalInMinutes = inHours * 60 + inMinutes;
    const leaveMinutes = totalInMinutes + remainingMinutes;
    const leaveHours = Math.floor(leaveMinutes / 60) % 24;
    const leaveMins = leaveMinutes % 60;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const conHour = hour * 60 + minute
    console.log(conHour)
    const conHour1 =leaveHours *60 + leaveMins
    console.log(conHour1)
    const remain = conHour1 - conHour
    console.log(remain)
    
    


    const hours = Math.floor(remain / 60);
    const minutes = remain % 60;
    
    if (remain > 0 ){
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        document.getElementById('result1').style.color = 'red';
        document.getElementById('result1').innerText = `Remaining Time is : ${formattedTime}`;
    } else {
    document.getElementById('result1').style.color = 'green';
    document.getElementById('result1').innerText = "Your time is allready completed";
    exit();
    location.reload();
    }
    



    const formattedLeaveTime = `${leaveHours.toString().padStart(2, '0')}:${leaveMins.toString().padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    

    

    document.getElementById('result').innerText = `You can leave at: ${formattedLeaveTime}`;
    
    

}



