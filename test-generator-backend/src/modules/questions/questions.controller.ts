import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
import { CreateMcqQuestionDto } from './dto/create-mcq-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('long')
  create(@Body() createQuestionDto: CreatelngQuestionDto) {
    return this.questionsService.createLongQuestion(createQuestionDto);
  }

  @Post('short')
  createShort(@Body() createQuestionDto: CreateShortQuestionDto) {
    return this.questionsService.createShortQuestion(createQuestionDto);
  }

  @Post('mcq')
  createMcq(@Body() createMcqQuestion: CreateMcqQuestionDto) {
    return this.questionsService.createMcqQuestion(createMcqQuestion);
  }

  @Get()
  findAlllng() {
    return this.questionsService.findAlllngQuestions();
  }
  
  @Get('mcq')
  findAllmcq() {
    return this.questionsService.findAllmcqQuestions();
  }
  
  @Get('short')
  findAllshort() {
    return this.questionsService.findAllshortQuestions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
