import { Router } from "express";
import { createCalendarEventController, deleteCalendarEventController, getAllCalendarEventsController, getAllUpComingCalendarEventsController, getCalendarEventsController, updateCalendarEventController } from "../controllers/crud/calendarEvents.controller.js";

const router=Router();

// get all events by passing userId days--> 0 to get all upcoming events from curentDate
router.get("/upcoming/:id/:days",getAllUpComingCalendarEventsController);

// get all events by passing userId
router.get("/all/:id/:days",getAllCalendarEventsController);

// get events as per the event Id
router.get("/:id",getCalendarEventsController);

// create event controller
router.post("/",createCalendarEventController);

// update event according to the event id
router.put("/:id",updateCalendarEventController);

// delete event accrording to event id
router.delete("/:id",deleteCalendarEventController);

// delete all events associated with user by passing userId
router.get("user/:id",getAllCalendarEventsController);

export default router;