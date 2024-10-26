export default function HelpCenter() {
    return (
        <div className="flex flex-col md:flex-row justify-center p-6 bg-gray-50">
            
            {/* Caja de Ayuda */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/2 mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white flex items-center justify-center w-12 h-12 rounded-full text-2xl font-bold">
                        ?
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">¿Necesitas ayuda?</h2>
                <p className="text-gray-600 mb-4">
                    Si tienes algún problema con nuestra plataforma o necesitas ayuda con la gestión de un trámite, por favor contáctanos en
                    <a href="mailto:contactenos@alcaldiasoacha.gov.co" className="text-blue-600 underline"> contactenos@alcaldiasoacha.gov.co</a>.
                </p>
            </div>

            {/* Caja de Contacto */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/2 mb-6 md:mb-0">
                <div className="">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Línea de atención a la ciudadanía</h3>
                    <p className="text-green-600 text-lg font-medium mb-2 flex items-center">
                        <span className="mr-2">📞</span>(601) 5800364
                    </p>
                    <p className="text-gray-600 mb-2">
                        Lunes a viernes: 7:00 a.m. - 6:00 p.m.<br />
                        Sábados: No laboramos, ya que estamos en constante aprendizaje.
                    </p>
                    <p className="text-gray-600">
                        Estamos ubicados en: Carrera 7ª No. 30b – 139.<br />
                    </p>
                </div>
            </div>
        </div>
    );
}
