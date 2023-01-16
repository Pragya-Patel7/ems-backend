const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const user1 = uuidv4();
const user2 = uuidv4();

const user_polls1 = uuidv4();
const user_polls2 = uuidv4();

const poll_option1 = uuidv4();
const poll_option2 = uuidv4();

const activity1 = uuidv4();
const activity2 = uuidv4();

const activity_poll1 = uuidv4();
const activity_poll2 = uuidv4();

const option1 = uuidv4();
const option2 = uuidv4();

const category_id1 = uuidv4();
const category_id2 = uuidv4();

const campaign_id1 = uuidv4();
const campaign_id2 = uuidv4();

const poll_duration1 = uuidv4();
const poll_duration2 = uuidv4();
const poll_duration3 = uuidv4();
const poll_duration4 = uuidv4();

exports.seed = (knex) => {
  // Delete all existing entries:
  return knex("admins")
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
          email: "rahul@gmail.com",
          password: `${await password("admin")}`,
          campaign_id: "b5eb-41d1-80cb-b6cc92318e3b",
          status: true,
          created_at: "2022-12-28",
          modified_at: "2022-12-28",
          is_deleted: 0,
        },
        {
          id: user2,
          name: "Yadav",
          email: "yadav@gmail.com",
          password: `${await password("admin")}`,
          campaign_id: "b5eb-41d1-80cb-b6cc92318e3b",
          status: true,
          created_at: "2022-12-28",
          modified_at: "2022-12-28",
          is_deleted: 0,
        },
      ]);
    })
    .then(() => {
      return knex("user_polls").insert([
        {
          id: user_polls1,
          user_id: user1,
          poll_id: activity_poll1,
          Option_id: poll_option1,
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: 0,
        },
        {
          id: user_polls2,
          user_id: user2,
          poll_id: activity_poll1,
          Option_id: poll_option2,
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: 0,
        },
      ]);
    })
    .then(() => {
      return knex("activity").insert([
        {
          id: activity1,
          name: "Poll activity",
          status: true,
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: false,
        },
        {
          id: activity2,
          name: "Loco Play",
          status: true,
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("activity_poll").insert([
        {
          id: activity_poll1,
          activity_id: activity1,
          question: "Who built this code?",
          coin: 4,
          start_date: "2023-01-01",
          duration: String(poll_duration4),
          status: true,
          category_id: category_id1,
          campaign_id: campaign_id1,
          poll_name: "Poll 1",
          image: "/image.jpg",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: false,
        },
        {
          id: activity_poll2,
          activity_id: activity2,
          question: "Who is Godfather?",
          coin: 4,
          start_date: "2023-01-01",
          duration: String(poll_duration1),
          status: true,
          category_id: category_id2,
          campaign_id: campaign_id2,
          poll_name: "Poll 2",
          image: null,
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
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
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: false,
        },
        {
          id: option2,
          poll_id: activity_poll2,
          option: "Rahul Yadav",
          option_image: null,
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("categories").insert([
        {
          id: category_id1,
          name: "Sports",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          status: true,
          is_deleted: false,
        },
        {
          id: category_id2,
          name: "Technology",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          status: true,
          is_deleted: false,
        },
      ]);
    })
    .then(() => {
      return knex("poll_duration").insert([
        {
          id: poll_duration1,
          duration: "Yearly",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          status: true,
          is_deleted: false,
        },
        {
          id: poll_duration2,
          duration: "Monthly",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          status: true,
          is_deleted: false,
        },
        {
          id: poll_duration3,
          duration: "Weekly",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          status: true,
          is_deleted: false,
        },
        {
          id: poll_duration4,
          duration: "Daily",
          created_at: "2022-12-29",
          modified_at: "2022-12-29",
          status: true,
          is_deleted: false,
        },
      ]);
    })
}