import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateMcqQuestionDto } from './dto/update-mcq-question.dto';
import { ListQuestionsQueryDto } from './dto/list-questions-query.dto';
import { AdminOnly } from 'src/common/decorator/admin-only.decorator';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Create Endpoints
  // @Post('createlong')
  // create(@Body() createQuestionDto: CreatelngQuestionDto) {
  //   return this.questionsService.createLongQuestion(createQuestionDto);
  // }

  // @Post('creatshort')
  // createShort(@Body() createQuestionDto: CreateShortQuestionDto) {
  //   return this.questionsService.createShortQuestion(createQuestionDto);
  // }

  // @Post('createmcq')
  // createMcq(@Body() createMcqQuestion: CreateMcqQuestionDto) {
  //   return this.questionsService.createMcqQuestion(createMcqQuestion);
  // }

  // Find All Endpoints — scoped by chapterId / bookId / classId with pagination
  @Get()
  findAlllng(@Query() query: ListQuestionsQueryDto) {
    return this.questionsService.findAlllngQuestions(query);
  }

  @Get('getmcq')
  findAllmcq(@Query() query: ListQuestionsQueryDto) {
    return this.questionsService.findAllmcqQuestions(query);
  }

  @Get('getshort')
  findAllshort(@Query() query: ListQuestionsQueryDto) {
    return this.questionsService.findAllshortQuestions(query);
  }

  // Delete Endpoints
  @AdminOnly()
  @Delete('delLng/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.removeLngQ(id);
  }

  @AdminOnly()
  @Delete('delShort/:id')
  removeShort(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.removeShortQ(id);
  }

  @AdminOnly()
  @Delete('delMcq/:id')
  removeMcq(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.removeMcqQ(id);
  }

  // Typed updates for admin tools that hit resource routes
  @AdminOnly()
  @Patch('long/:id')
  updateLong(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateLongQuestion(id, updateQuestionDto);
  }

  @AdminOnly()
  @Patch('short/:id')
  updateShort(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateShortQuestion(id, updateQuestionDto);
  }

  @AdminOnly()
  @Patch('mcq/:id')
  updateMcq(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMcqQuestionDto: UpdateMcqQuestionDto,
  ) {
    return this.questionsService.updateMcqQuestion(id, updateMcqQuestionDto);
  }
}
