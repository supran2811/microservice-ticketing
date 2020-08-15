import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorisedError,
  OrderCancelledEvent,
} from '@ssorg/common';

import { OrderCancelledPubliser } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Order, OrderStatus } from '../models/order';
const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    /// publish an event that order is updated now to cancelled

    new OrderCancelledPubliser(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    return res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
