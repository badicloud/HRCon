﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Documents
{
  public class GetDocumentInfoInput : IInputDto
  {
    public int DocumentId { get; set; }
  }
}