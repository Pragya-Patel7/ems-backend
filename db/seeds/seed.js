const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const timeUtils = require("../../utils/timeUtils");
const TimeUtils = require("../../utils/timeUtils");

const user1 = uuidv4();
const user2 = uuidv4();

const user_polls1 = uuidv4();
const user_polls2 = uuidv4();

const poll_option1 = uuidv4();
const poll_option2 = uuidv4();

const activity1 = 1;
const activity2 = 2;

const activity_poll1 = uuidv4();
const activity_poll2 = uuidv4();

const option1 = uuidv4();
const option2 = uuidv4();

const category_id1 = uuidv4();
const category_id2 = uuidv4();

const campaign_id1 = uuidv4();
const campaign_id2 = uuidv4();

const poll_coin_value = process.env.POLL_ACTIVITY_COIN_VALUE;
const quiz_coin_value = process.env.QUIZ_ACTIVITY_COIN_VALUE;

exports.seed = (knex) => {
  // Delete all existing entries:
  return knex("admins")
    .then(() => {
      return knex("roles").insert([
        {
          id: 1,
          role: "Super admin",
          status: true,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: 2,
          role: "Admin",
          status: true,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: 3,
          role: "Client admin",
          status: true,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        }
      ]);
    })
    .then(async () => {
      const salt = await bcrypt.genSalt();
      const password = async (pass) => {
        const hashedPassword = await bcrypt.hash(String(pass), salt);
        return hashedPassword;
      }

      return knex("admins").insert([
        {
          id: user1,
          name: "Rahul",
          email: "rahul1210rk@gmail.com",
          password: `${await password("admin")}`,
          campaign_id: "1",
          campaign_name: "Plutos One",
          client_id: 1,
          client_name: "Plutos One",
          role_id: 1,
          status: true,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: 0,
        },
        {
          id: user2,
          name: "Yadav",
          email: "rahul@plutos.one",
          password: `${await password("ems123")}`,
          campaign_id: "b5eb-41d1-80cb-b6cc92318e3b",
          campaign_name: "Hackathon",
          client_id: 2,
          client_name: "Reskilll",
          role_id: 1,
          status: true,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: 0,
        },
      ]);
    })
    .then(() => {
      return knex("user_polls").insert([
        {
          id: user_polls1,
          user_id: user1,
          campaign_id: 1,
          poll_id: activity_poll1,
          Option_id: poll_option1,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: 0,
        },
        {
          id: user_polls2,
          user_id: user2,
          campaign_id: "b5eb-41d1-80cb-b6cc92318e3b",
          poll_id: activity_poll1,
          Option_id: poll_option2,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: 0,
        },
      ]);
    })
    .then(() => {
      return knex("activity").insert([
        {
          id: 1,
          name: "Poll",
          coin_value: poll_coin_value,
          status: true,
          created_at: timeUtils.date(),
          modified_at: timeUtils.date(),
          is_deleted: false,
        },
        {
          id: 2,
          name: "Quiz",
          coin_value: quiz_coin_value,
          status: true,
          created_at: timeUtils.date(),
          modified_at: timeUtils.date(),
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("activity_poll").insert([
        {
          id: activity_poll1,
          activity_id: 1,
          poll_name: "Guess who?",
          category_id: 3,
          campaign_id: 1,
          campaign_name: "Plutos One",
          question: "Who built this code?",
          duration_id: 1,
          image: "/image.jpg",
          start_date: TimeUtils.date(),
          end_date: TimeUtils.tomorrow(),
          created_by: "Rahul",
          modified_by: "Rahul",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: activity_poll2,
          activity_id: 1,
          poll_name: "Mastermind",
          category_id: 7,
          campaign_id: "b5eb-41d1-80cb-b6cc92318e3b",
          campaign_name: "Hackathon",
          question: "Which one is the capital of India?",
          duration_id: 4,
          image: "/image.jpg",
          start_date: TimeUtils.date(),
          end_date: TimeUtils.tomorrow(),
          created_by: "Rahul",
          modified_by: "Rahul",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("poll_option").insert([
        {
          id: option1,
          poll_id: activity_poll1,
          option: "Rahul Yadav",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: option2,
          poll_id: activity_poll1,
          option: "Pratham Bharti",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: "6sd5c6s-4c5-wc651w",
          poll_id: activity_poll1,
          option: "Suraj Rajbhar",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: "234sd754-w6s5d4w-6d84w",
          poll_id: activity_poll1,
          option: "Pawan Singh",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: "asd654v123-we54-8wd4",
          poll_id: activity_poll2,
          option: "Rishikesh",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: "bgf15xz-m1n5bv-wfe84re-we84f",
          poll_id: activity_poll2,
          option: "Kerala",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: "we98dfgb-d56-s65ad4-kyjg",
          poll_id: activity_poll2,
          option: "West Bengal",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
        {
          id: "dfb5fg-sd5-s65dvf1ds-fv",
          poll_id: activity_poll2,
          option: "New Delhi",
          option_image: null,
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("categories").insert([
        {
          id: 1,
          name: "Sports",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 2,
          name: "Politics",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 3,
          name: "Entertainment",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 4,
          name: "Bollywood",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 5,
          name: "Technology",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 6,
          name: "Business",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 7,
          name: "Knowledge",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 8,
          name: "Other",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("poll_duration").insert([
        {
          id: 1,
          duration: "Daily",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 2,
          duration: "Weekly",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 3,
          duration: "Monthly",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
        {
          id: 4,
          duration: "Yearly",
          created_at: TimeUtils.date(),
          modified_at: TimeUtils.date(),
          status: true,
          is_deleted: false,
        },
      ]);
    })
}