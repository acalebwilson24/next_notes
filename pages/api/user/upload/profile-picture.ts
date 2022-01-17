import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect';
import multer from 'multer'
import { prisma } from "../../../../prisma/client";
import { getSession } from "next-auth/react";

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

// Process a POST request
apiRoute.post(async (req, res, next) => {
    const session = await getSession({ req });

    if (!session) {
        return res.send("No Session");
    }
    next()

}, upload.single("profilePicture"), async (req, res) => {
    console.log(req.file);

    const session = await getSession({ req });
    if (!session) {
        return
    }

    const user = await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            image: "/uploads/" + req.file?.filename
        }
    })


    res.status(200).json(user);
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute;
