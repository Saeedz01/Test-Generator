import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
import { CreateMcqQuestionDto } from './dto/create-mcq-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Create Endpoints
  @Post('createlong')
  create(@Body() createQuestionDto: CreatelngQuestionDto) {
    return this.questionsService.createLongQuestion(createQuestionDto);
  }

  @Post('creatshort')
  createShort(@Body() createQuestionDto: CreateShortQuestionDto) {
    return this.questionsService.createShortQuestion(createQuestionDto);
  }

  @Post('createmcq')
  createMcq(@Body() createMcqQuestion: CreateMcqQuestionDto) {
    return this.questionsService.createMcqQuestion(createMcqQuestion);
  }

  // Find All Endpoints
  @Get()
  findAlllng() {
    return this.questionsService.findAlllngQuestions();
  }
  
  @Get('getmcq')
  findAllmcq() {
    return this.questionsService.findAllmcqQuestions();
  }
  
  @Get('getshort')
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

  // Delete Endpoints
  @Delete('delLng/:id')
  remove(@Param('id') id: string) {
    return this.questionsService.removeLngQ(id);
  }
  
  @Delete('delShort/:id')
  removeShort(@Param('id') id: string) {
    return this.questionsService.removeShortQ(id);
  }
  
  @Delete('delMcq/:id')
  removeMcq(@Param('id') id: string) {
    return this.questionsService.removeMcqQ(id);
  }
}
