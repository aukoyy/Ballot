const router = require('express').Router();
import { Request, Response } from 'express';
const ActivePoll = require('../schemas/ActivePoll');
import v4 = require('uuid/v4');

router.post('/new', async (req: Request, res: Response) => {
  const activePollAlreadyExistsOnPoll = await ActivePoll.findOne({
    pollId: req.body.pollId,
  });

  if (activePollAlreadyExistsOnPoll) {
    res.status(400).send({ err: 'Poll is already conducting' });
    return;
  }

  const newActivePoll = new ActivePoll({
    pollId: req.body.pollId,
    currentQuestion: 0,
  });

  try {
    await newActivePoll.save();
    res.status(200).send(newActivePoll);
  } catch (err) {
    res.status(400).send(err);
  }
});

// patch. frontend controls what is updated

router.delete('/:id', async (req: Request, res: Response) => {
  const activePollId = req.params.id;
  const poll = await ActivePoll.findOneAndDelete(
    { _id: activePollId },
    function(err) {
      err ? console.log(err) : console.log('successful deletion');
    }
  );
  res
    .status(200)
    .send(`Successfully deleted activePoll with id: ${activePollId}`);
});

module.exports = router;
