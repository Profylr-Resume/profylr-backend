import { Router } from "express";
import { createCalendarEvent, deleteAllCalendarEventController, deleteCalendarEventController, getAllCalendarEventsController, getAllUpComingCalendarEventsController, getCalendarEventsController, updateCalendarEventController } from "../controllers/crud/calendarEvents.controller.js";

const router=Router();

// get all events by passing  days--> 0 to get all upcoming events from curentDate
router.get("/upcoming/:days",getAllUpComingCalendarEventsController);

// get all events by passing days-->0 it will also get the previous events from the current date 
router.get("/all/:days",getAllCalendarEventsController);

// get events as per the event Id
router.get("/:id",getCalendarEventsController);

// create event controller
router.post("/",createCalendarEvent);

// update event according to the event id
router.put("/:id",updateCalendarEventController);

// delete event accrording to event id
router.delete("/:id",deleteCalendarEventController);

// delete all events associated with user by passing userId
router.delete("/user",deleteAllCalendarEventController);

export default router;