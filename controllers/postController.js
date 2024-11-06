import PostModel from '../models/posts.js';

export const getAll = async (req, res) => {
    try {
        const post = await PostModel.find().populate({ path: "user", select: ["fullName", "avtarUrl"] });

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }).then((err, doc) => {

            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }

            res.json({
                success: true,
            })
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewCount: 1 },
            },
            {
                returnDocument: "after",
            }).then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    });
                }
                res.json(doc);
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
};


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        );

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }

}