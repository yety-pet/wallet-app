const newUserValidation = async (req, res, next) => {

   try { 
    const { fullname, email, password, phonenumber } = req.body

    let errors = []

    if(!fullname){
        errors.push("Enter you Full-Name")
    }

    if(!phonenumber){
        errors.push("Please enter you active phone Number")
    }
    if(!email){
        errors.push("Please enter email")

    } else if(!ValidEmail(email)){
        errors.push("Invalid email")
    }

    if(!password){
        errors.push("Please enter a password")
        
    } else if(password.length < 6){
        errors.push("Password must be 6 chars.")

    } else if(!/[0-9]/.test(password)){
        errors.push("Password must contain a number")
    }

    if(errors.length > 0){
        return res.status(400).json({ message: errors})
    }

   } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' })
}

   next()

}

const loginValidation = async (req, res, next) => {

    try { 
     const { email, password } = req.body
 
     let errors = []
 

     if(!email){
         errors.push("Please enter your email")
 
     } else if(!ValidEmail(email)){
         errors.push("Invalid email")
     }
 
     if(!password){
         errors.push("Please enter your password")
         }

         if(errors.length > 0){
            return res.status(400).json({ message: errors})
        }

        
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server Error' })
        }
        
        next()

    }

    const ValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
        return emailPattern.test(email)
    }
    
    

    module.exports = { newUserValidation, loginValidation, ValidEmail}
