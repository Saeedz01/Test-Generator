import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
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
  createMcq(@Body() createQuestionDto: CreatelngQuestionDto) {
    return this.questionsService.createMcqQuestion(createQuestionDto);
  }

  @Get()
  findAll() {
    return this.questionsService.findAll();
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
