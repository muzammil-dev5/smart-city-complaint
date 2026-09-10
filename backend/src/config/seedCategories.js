const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const categories = [
    {
        value: "road_damage",
        name: "Road Damage",
        urduName: "سڑک کا نقصان",
    },
    {
        value: "street_light",
        name: "Street Light",
        urduName: "اسٹریٹ لائٹ",
    },
    {
        value: "garbage_collection",
        name: "Garbage Collection",
        urduName: "کچرا اٹھانا",
    },
    {
        value: "water_leakage",
        name: "Water Leakage",
        urduName: "پانی کا رساؤ",
    },
    {
        value: "drainage",
        name: "Drainage",
        urduName: "نکاسی آب",
    },
    {
        value: "traffic_signal",
        name: "Traffic Signal",
        urduName: "ٹریفک سگنل",
    },
    {
        value: "fallen_tree",
        name: "Fallen Tree",
        urduName: "گرا ہوا درخت",
    },
    {
        value: "illegal_construction",
        name: "Illegal Construction",
        urduName: "غیر قانونی تعمیرات",
    },
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");

        for (const category of categories) {
            await Category.updateOne(
                { value: category.value },
                { $set: category },
                { upsert: true }
            );
        }

        console.log("Categories seeded successfully");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Category seed error:", error);
        process.exit(1);
    }
};

seedCategories();