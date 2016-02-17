using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp.Application.Services;
using HRConcourse.Documents;

namespace HRConcourse.PdfRendering
{
    public class PdfToImageService : ApplicationService
    {
        public virtual Dictionary<int, Image> ConvertPdfToImages(byte[] pdfBytes)
        {
            var imageConverterFolder = ConfigurationManager.AppSettings["PdfImageConverterFolder"];
            var programsPath = HttpContext.Current.Server.MapPath(imageConverterFolder);
            var tempPdfFile = Path.GetTempFileName();
            File.WriteAllBytes(tempPdfFile, pdfBytes);

            var p = new Process();
            string processOutput = string.Empty;

            var tempPathGuid = Guid.NewGuid().ToString();
            var tempPath = Path.GetTempPath() + tempPathGuid;
            var workDirectory = new DirectoryInfo(tempPath);
            workDirectory.Create();
            //Create Images
            p = new Process
            {
                StartInfo =
                {
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    FileName = programsPath + "\\gswin32c.exe",
                    Arguments =
                        "-dNOPAUSE -dPDFFitPage -dBATCH -dEPSCrop -r150 -sPAPERSIZE=letter -dSAFER -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -sOutputFile=\"" +
                        tempPath + "\\output-%d.png\" \"" + tempPdfFile + "\"",
                    WindowStyle = ProcessWindowStyle.Hidden
                }
            };
            p.Start();
            p.WaitForExit();

            var auxResult = new Dictionary<int, Image>();
            int index = 0;
            foreach (var pdfImage in workDirectory.GetFiles("*.png").Select(fi => fi.FullName).OrderBy(fi => int.Parse(fi.Split('-').Last().Split('.').First())).ToList())
            {
                var image = new Image();
                image.Data = File.ReadAllBytes(pdfImage);
                auxResult.Add(index, image);
                index++;
            }
            Directory.Delete(tempPath, true);
            return auxResult;

        }
    }
}
