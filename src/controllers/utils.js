export const emailValidator = email => {
    const re = /\S+@\S+\.\S+/;
  
    if (!email || email.length <= 0) return "Email cannot be empty.";
    if (!re.test(email)) return "Ooops! We need a valid email address.";
  
    return "";
};

export const passwordValidator = password => {
    if (!password || password.length <= 0) return "Password cannot be empty.";
  
    return "";
  };
  
  export const nameValidator = name => {
    if (!name || name.length <= 0) return "Name cannot be empty.";
  
    return "";
  };

  // Validate Task Name
  export const TaskNameValidator = name => {
    if (!name || name.length <= 0) return "Task name cannot be empty.";
    return "";
  };

  // Validate Task dueDate and reminderDate
  export const TaskDateValidator = date => {
    // Date can be empty
    if(date == "")
      return "";

    // First check for the pattern (MM-DD-YYYY)
    console.log("Date " + date);
    if(!/^\d{1,2}\-\d{1,2}\-\d{4}$/.test(date))
        return "Please enter a valid date (MM-DD-YYYY)";

    // Parse the date parts to integers
    var parts = date.split("-");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return "Please enter a valid date (MM-DD-YYYY)";

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    if(day > 0 && day <= monthLength[month - 1])
        return "";
    return "Please enter a valid date (MM-DD-YYYY)";
  };

  // Validate Task description
  export const TaskDescriptionValidator = decription => {
    return "";
  };

  // Validate Task rcvPts and possiblePts
  export const TaskPointsValidator = points => {
    if(points == "")
    {
      return "";
    }
    points = Number(points);
    if(isNaN(points)){
      return "Please enter a number";
    }
    if(points < 0){
      return "Please enter a number bigger than 0."
    }
    return "";
  }

  // Validate Task weight
  export const TaskWeightValidator = weight => {
    if(weight == "")
    {
      return "";
    }
    weight = Number(weight);
    if(isNaN(weight)){
      return "Please enter a number";
    }
    if(weight < 0 || weight >100){
      return "Please enter a number between 0 and 100";
    }
    return "";
  }