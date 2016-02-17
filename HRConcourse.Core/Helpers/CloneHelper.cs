using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.Helpers
{
    public static class CloneHelper
    {
        public static T CloneDeclaredOnly<T>(this T input) where T:new()
        {
            var result = new T();
            var declaredProperties = from prop in input.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public | System.Reflection.BindingFlags.DeclaredOnly) select prop;

            foreach (var property in declaredProperties)
            {
                var val = property.GetValue(input);
                property.SetValue(result, val);
            }
            return result;
        }
    }
}
