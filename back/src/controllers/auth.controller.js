import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import { sendEmail, getTemplate } from "../mail.config.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({
        message: ["The email is already in use"],
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser;

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });
    await userSaved.save();

    const template = getTemplate(username, token);
    // Enviar el email
    await sendEmail(email, template);


    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        message: ["The email does not exist"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }
    if(userFound.status === 'UNVERIFIED'){
      return res.status(401).json({
        message: ["Email unverified"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });

   

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      status: userFound.status,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const verifyToken = async (req, res) => {
//   console.log(req.cookies)
//   const { token } = req.cookies;
//   if (!token) return res.send("no token available");

//   jwt.verify(token, TOKEN_SECRET, async (error, user) => {
//     if (error) return res.sendStatus(401).json({msg:"no token 1"});

//     const userFound = await User.findById(user.id);
//     if (!userFound) return res.sendStatus(401).json({msg:"no token 1"});

//     return res.json({
//       id: userFound._id,
//       username: userFound.username,
//       email: userFound.email,
//     });
//   });
// };

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200).json({msg:"logout exitoso"});
};

export const confirm = async (req, res) =>{
  try {

    // Obtener el token
    const { token } = req.params;
    
    // Verificar la data
    let data = null;
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if(err) {
          console.log('Error al obtener data del token ----->',err);
      } else {
          data = decoded;
      }
  });

    if(data === null) {
         return res.json({
             success: false,
             msg: 'Error al obtener data'
         });
    }

    console.log(data);

    const { id} = data.id;

    // Verificar existencia del usuario
    const user = await User.findOne({ id }) || null;

    if(user === null) {
         return res.json({
             success: false,
             msg: 'Usuario no existe'
         });
    }


    // Actualizar usuario
    user.status = 'VERIFIED';
    await user.save();

    // Redireccionar a la confirmación
    return res.redirect('/confirm.html');
     
 } catch (error) {
     console.log(error);
     return res.json({
         success: false,
         msg: 'Error al confirmar usuario'
     });
 }
}

export const profile = async (req, res) =>{
  const userFound  = await User.findById(req.user.id);
  if(!userFound)  return res.status(400).json({msg:"Usuario no encontrado"});
  return res.json({
    id: userFound.id,
    username: userFound.username,
    email: userFound.email,
  })
}