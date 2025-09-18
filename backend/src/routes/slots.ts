import { Router, Request, Response } from 'express';
import { SlotService } from '../services/slotService';
import { z } from 'zod';

const router = Router();
// Using real database service
const slotService = new SlotService();

// Validation schemas
const createSlotSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  category: z.string().optional()
});

const updateSlotSchema = z.object({
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  category: z.string().optional()
});

// Create a new slot
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Creating slot with data:', req.body);
    const validatedData = createSlotSchema.parse(req.body);
    console.log('Validated data:', validatedData);
    
    const slot = await slotService.createSlot(validatedData);
    console.log('Slot created successfully:', slot);
    res.status(201).json(slot);
  } catch (error) {
    console.error('Slot creation error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      res.status(400).json({ error: 'Invalid input data', details: error.errors });
    } else {
      console.error('Database error:', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
});

// Get slots for a week
router.get('/week', async (req: Request, res: Response) => {
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
router.put('/:id', async (req: Request, res: Response) => {
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
router.delete('/:id', async (req: Request, res: Response) => {
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
