export class VisitAnalysisResult {
    public result: {
        analisis: string[];
        recomendaciones: string[];
    } = {
            analisis: [],
            recomendaciones: []
        };
    public status: string = '';
    public video_id: string = '';
}

