import { Router } from 'express';
import { SlotService } from '../services/slotService';
import { DemoSlotService } from '../demo-service';
import { z } from 'zod';

const router = Router();
// Using real database service
const slotService = new SlotService();

// Validation schemas
const createSlotSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
});

const updateSlotSchema = z.object({
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
});

// Create a new slot
router.post('/', async (req, res) => {
  try {
    const validatedData = createSlotSchema.parse(req.body);
    const slot = await slotService.createSlot(validatedData);
    res.status(201).json(slot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get slots for a week
router.get('/week', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const slots = await slotService.getSlotsForWeek(
      start_date as string,
      end_date as string
    );
    
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a slot
router.put('/:id', async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);
    const validatedData = updateSlotSchema.parse(req.body);
    
    const slot = await slotService.updateSlot(slotId, validatedData);
    res.json(slot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input data', details: error.errors });
    } else if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete a slot
router.delete('/:id', async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);
    await slotService.deleteSlot(slotId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export { router as slotsRouter };
