using HRConcourse.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRConcourse.Documents.Dto;
using Xunit;

using Shouldly;
namespace HRConcourse.Tests.Documents
{
    public class DocumentAppService_Tests : HRConcourseTestBase
    {

        private readonly DocumentsAppService _documentsAppService;

        public DocumentAppService_Tests()
        {
            _documentsAppService = Resolve<DocumentsAppService>();
        }


        [Fact]
        public async Task Should_Get_One_Document_After_Insert()
        {
            //Arrange
            LoginAsDefaultTenantAdmin();

            var docInput = new HRConcourse.Documents.Dto.CreateDocumentInput() { Name = "Pepe" };
            //Act
            _documentsAppService.CreateDocument(docInput);

            //Assert
            var documents = _documentsAppService.GetDocuments(new GetDocumentsInput());

            documents.Documents.ShouldNotBeEmpty();
        }


        [Fact]
        public async Task Document_Cannot_Be_Readonly_And_HardSignature_Simultaneusly()
        {
            //Arrange
            LoginAsDefaultTenantAdmin();

            //Act
            var document = new Document();
            document.IsReadOnly = true;
            //Assert
            Assert.Throws<ArgumentException>(() => { document.RequiresHardSignature = true; });
            //Act
            document.IsReadOnly = false;
            document.RequiresHardSignature = true;
            //Assert
            Assert.Throws<ArgumentException>(() => { document.IsReadOnly = true; });
        }
    }
}
