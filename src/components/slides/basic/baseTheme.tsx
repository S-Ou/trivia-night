import { SlideThemeBase } from "../baseSlideTheme";
import { QuestionSlide } from "./questionSlide";
import { ResultSlide } from "./resultSlide";
import { SummarySlide } from "./summarySlide";
import { TitleSlide } from "./titleSlide";
import HomeSlide from "./homeSlide";

export class BaseTheme extends SlideThemeBase {
  static title = "Base";
  static id = "base";

  HomeSlide = HomeSlide;
  TitleSlide = TitleSlide;
  QuestionSlide = QuestionSlide;
  SummarySlide = SummarySlide;
  ResultSlide = ResultSlide;
}

export class DuplicateBaseTheme extends SlideThemeBase {
  static title = "Base dupe";
  static id = "base-dupe";

  HomeSlide = HomeSlide;
  TitleSlide = TitleSlide;
  QuestionSlide = QuestionSlide;
  SummarySlide = SummarySlide;
  ResultSlide = ResultSlide;
}
